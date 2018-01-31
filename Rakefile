require 'pry'
require 'json'
require 'net/http'

task default: :migrate_data_to_templates



DATA_DIR = File.expand_path("../_data/", __FILE__)
desc "Migrate the JSON files located in the data directory into he appropriate project buckets as templates"
task :migrate_data_to_templates do 
  items = {}
  files = ["Photo Upload.json", "Video ID.json"].map{|f| File.join(DATA_DIR, f)}

  files.each do |file|
    content = JSON.parse(File.read(file))
    sheets = content.keys
    sheets.each do |sheet|
      content[sheet].each do |blob|
        if file =~ /Photo Upload/

          # get the image, put it somewhere
          remote_filename, extension =  blob["Photo"].split('/')[-1].split('.')
          project_name =  blob["Project"].downcase.gsub(/[^0-9a-z\-]/, '-')
          
          filename = [
                     project_name, 
                     blob["Name"].downcase.gsub(/[^0-9a-z\-]/, '-'),
                     remote_filename.downcase.gsub(/[^0-9a-z\-_]/, '-')[0,10],
          ].join('-') + ".#{extension}"

          # skip if we already have this file synced
          root_path = "#{File.join('/', '_projects', project_name, 'images')}"
          
          img_dir = File.expand_path(('..' + root_path), __FILE__)

          unless Dir.exist?(img_dir)
            puts 'creating ' + img_dir
           `mkdir -p #{img_dir}`
          end

          filepath = File.join(img_dir, filename)
          webpath = File.join(root_path, filename)
          
          # remote_file_body = Net::HTTP.get(URI(blob["Photo"]))

          # File.write(filepath, remote_file_body)

          # TODO make this an includable thing
          items[project_name] ||= []
          items[project_name] << "<div class=\"item\"> <img src=\"#{ webpath }\" title=\"#{blob["Name"]}\" alt=\"#{blob["Name"]}\" /></div>"
        elsif file =~ /Video ID/
          project_name =  blob["Project"].downcase.gsub(/[^0-9a-z\-]/, '-')
          items[project_name] ||= []
          items[project_name] << ('<div class="item"><iframe src="https://player.vimeo.com/video/'+ blob["VimeoID"] + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')
        end
      end
    end
  end
  items.keys.each do |proj|
    items_list = items[proj].shuffle
    include_file = "_includes/#{proj}-items.html"
    puts "writing updated " + include_file
    File.write(include_file, items_list.join("\n"))
  end
end

