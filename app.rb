require 'sinatra'
require 'sinatra/json'
require 'fileutils'
require 'tempfile'
require 'open3'
require 'securerandom'
require 'uri'

# Настройки
set :port, 4567
set :bind, '0.0.0.0'
set :views, File.dirname(__FILE__) + '/views'
set :public_folder, File.dirname(__FILE__) + '/public'
set :static, true
set :max_file_size, 50 * 1024 * 1024

# Создание директорий
DOWNLOAD_DIR = File.join(File.dirname(__FILE__), 'downloads')
OUTPUT_DIR = File.join(File.dirname(__FILE__), 'outputs')
FileUtils.mkdir_p(DOWNLOAD_DIR)
FileUtils.mkdir_p(OUTPUT_DIR)

# Главная страница с формой
get '/' do
  erb :index
end

# Обработка: видео по URL, субтитры из файла
post '/burn' do
  video_url = params[:video_url]

  if video_url.nil? || video_url.empty?
    return erb :error, locals: { message: "Необходимо указать URL видео файла" }
  end

  unless params[:subtitle_file] && params[:subtitle_file][:tempfile]
    return erb :error, locals: { message: "Необходимо выбрать файл субтитров" }
  end

  subtitle_file = params[:subtitle_file][:tempfile]
  subtitle_filename = params[:subtitle_file][:filename]

  font = params[:font] || 'Arial'
  font_size = params[:font_size] || 24
  primary_colour = params[:primary_colour] || '&H00FFFFFF'
  outline = params[:outline] || 1
  shadow = params[:shadow] || 2
  back_colour = params[:back_colour] || '&H80000000'

  job_id = SecureRandom.hex(16)

  begin
    video_ext = File.extname(URI.parse(video_url).path)
  rescue => e
    return erb :error, locals: { message: "Некорректный URL видео: #{e.message}" }
  end

  video_ext = '.mp4' if video_ext.empty?

  video_path = File.join(DOWNLOAD_DIR, "#{job_id}_video#{video_ext}")
  subtitle_ext = File.extname(subtitle_filename)
  subtitle_path = File.join(DOWNLOAD_DIR, "#{job_id}_subtitle#{subtitle_ext}")
  FileUtils.cp(subtitle_file.path, subtitle_path)

  output_path = File.join(OUTPUT_DIR, "#{job_id}_output.mp4")

  begin
    puts "📥 Скачивание видео: #{video_url}"
    system("wget", "-q", "--timeout=60", "--tries=3", "-O", video_path, video_url)

    unless File.exist?(video_path) && File.size(video_path) > 0
      return erb :error, locals: { message: "Не удалось скачать видео. Проверьте URL и доступность файла." }
    end

    puts "✅ Видео скачано: #{File.size(video_path)} байт"
    puts "📝 Субтитры: #{subtitle_path} (#{File.size(subtitle_path)} байт)"

    escaped_subtitle = subtitle_path.gsub("'", "'\\\\''")
    escaped_subtitle = escaped_subtitle.gsub(":", "\\:")

    style_params = "FontName=#{font},FontSize=#{font_size},PrimaryColour=#{primary_colour},BackColour=#{back_colour},Outline=#{outline},Shadow=#{shadow},BorderStyle=1"
    subtitles_filter = "subtitles='#{escaped_subtitle}':force_style='#{style_params}'"

    ffmpeg_cmd = [
      'ffmpeg',
      '-i', video_path,
      '-vf', subtitles_filter,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '20',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-movflags', '+faststart',
      '-y',
      output_path
    ]

    puts "🎬 Прожигаем субтитры..."
    stdout, stderr, status = Open3.capture3(*ffmpeg_cmd)

    if status.success? && File.exist?(output_path) && File.size(output_path) > 0
      puts "✅ Готово!"
      download_url = "/download/#{job_id}"
      erb :success, locals: { download_url: download_url, job_id: job_id }
    else
      error_msg = stderr[-500..-1] || "Неизвестная ошибка"
      erb :error, locals: { message: "Ошибка при обработке видео: #{error_msg}" }
    end
  rescue => e
    erb :error, locals: { message: "Ошибка: #{e.message}" }
  ensure
    Thread.new do
      sleep 300
      [video_path, subtitle_path].each { |f| FileUtils.rm_f(f) if f && File.exist?(f) }
    end
  end
end

get '/download/:job_id' do
  job_id = params[:job_id]
  output_file = Dir.glob(File.join(OUTPUT_DIR, "#{job_id}_*.mp4")).first

  if output_file && File.exist?(output_file)
    send_file output_file,
              filename: "video_with_subs_#{Time.now.strftime('%Y%m%d_%H%M%S')}.mp4",
              type: 'video/mp4',
              disposition: 'attachment'

    Thread.new do
      sleep 600
      FileUtils.rm_f(output_file) if File.exist?(output_file)
    end
  else
    erb :error, locals: { message: "Файл не найден или уже удален" }
  end
end

Thread.new do
  while true do
    sleep 1800
    [DOWNLOAD_DIR, OUTPUT_DIR].each do |dir|
      Dir.glob(File.join(dir, '*')).each do |file|
        if File.exist?(file) && File.mtime(file) < Time.now - 7200
          FileUtils.rm_f(file)
        end
      end
    end
  end
end

if __FILE__ == $0
  puts "=" * 60
  puts "🎬 Видео Сервис - Прожиг субтитров"
  puts "=" * 60
  puts "🚀 Сервер запущен на http://0.0.0.0:4567"
  puts "📁 Статические файлы: #{settings.public_folder}"
  puts "Нажмите Ctrl+C для остановки"
  puts ""

  Sinatra::Application.run!
end
