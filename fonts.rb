class Fonts
  def self.all
    @all ||= new.send(:parse_fonts)
  end

  def self.search(name)
    return [] if name.empty?

    all_fonts = @all.any? ? @all : all
    all_fonts.select { |font| font.name.include? name }
  rescue StandardError => e
    puts "Error search font with name #{name}: #{e.message}"
    []
  end

  class Font
    attr_reader :name, :path, :style

    def initialize(font_info)
      parse_info(font_info)
    end

    private

    def parse_info(info)
      parsed_info = info.split(':')
      @path = parsed_info[0]
      @style = parsed_info[-1]
      @name = parse_name
    end

    def parse_name
      file_name = path.split('/').last
      @name = file_name.split('.').first
    end
  end

  private

  def parse_fonts
    fonts_list = `#{font_list_command}`
    fonts = fonts_list.split("\n")
    fonts.map { |font_info| Font.new(font_info) }
  end

  def font_list_command
    'fc-list'
  end
end
