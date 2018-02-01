require 'json'
require 'net/http'

unless require 'sanitize'
  puts 'missing sanitize gem'
  puts 'install with "gem install sanitize"'
  puts 'exiting...'
  exit 1
end

task default: :migrate_data_to_templates

DATA_DIR = File.expand_path("../_data/", __FILE__)
desc "Migrate the JSON files located in the data directory into he appropriate project buckets as templates"
task :migrate_data_to_templates do 
  items = {}

  files = %w{ esm-photo.json esm-text.json esm-video.json }.map{|f| File.join(DATA_DIR, f)}

  files.each do |file|
    unless File.exist? file
      puts "missing #{file}, skipping"
      next
    end

    content = JSON.parse(File.read(file))
    sheets = content.keys
    sheets.each do |sheet|
      content[sheet].each do |blob|
        project_name =  Sanitize.fragment(blob["Project"]).downcase.gsub(/[^0-9a-z\-]/, '-')
        items[project_name] ||= []

        if file =~ /esm-photo.json/

           unless blob["Photo"] && blob["Name"]  && blob["Project"]
            puts "Invalid Photo submission!: "
            puts "  skippping #{blob.inspect}"
            next 
           end

          remote_filename, extension =  blob["Photo"].split('/')[-1].split('.')
          
          filename = [
                     project_name, 
                     Sanitize.fragment(blob["Name"]).downcase.gsub(/[^0-9a-z\-]/, '-'),
                     remote_filename.downcase.gsub(/[^0-9a-z\-_]/, '-')[0,10],
          ].join('-') + ".#{extension}"

          root_path = "#{File.join('/', '_projects', project_name, 'images')}"
          
          img_dir = File.expand_path(('..' + root_path), __FILE__)

          unless Dir.exist?(img_dir)
            puts 'creating ' + img_dir
           `mkdir -p #{img_dir}`
          end

          filepath = File.join(img_dir, filename)
          webpath = File.join(root_path, filename)
          
          unless File.exist? filepath
            puts "downloading " + blob["Photo"]
            remote_file_body = Net::HTTP.get(URI(blob["Photo"]))

            puts "creating " + filepath
            File.write(filepath, remote_file_body)
          else
            puts "#{filepath} already exists, skipping"
          end

          items[project_name] << "<div class=\"item\"> <img src=\"#{ webpath }\" title=\"#{Sanitize.fragment(blob["Name"])}\" alt=\"#{Sanitize.fragment(blob["Name"])}\" /></div>"
        elsif file =~ /esm-video.json/
          # only allow digit ids
          unless blob["VideoID"] =~ /^\d+$/
            puts "Invalid video ID!: "
            puts "  skippping #{blob.inspect}"
            next
          end

          unless blob["VideoID"] && blob["Name"]  && blob["Project"]
            puts "Invalid video submission!: "
            puts "  skippping #{blob.inspect}"
            next 
          end

          items[project_name] << ('<div class="item"><iframe src="https://player.vimeo.com/video/'+ Sanitize.fragment(blob["VideoID"]) + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')
        elsif file =~ /esm-text.json/
          unless blob["Text"] && blob["Name"]  && blob["Project"]
            puts "Invalid text submission!: "
            puts "  skippping #{blob.inspect}"
            next 
          end
          # TODO (do we want to credit commentors)
          items[project_name] << ('<div class="item"><p>' + Sanitize.fragment(blob["Text"]) + '</p></div>')
        end
      end
    end
  end
  items.keys.select{|x| x != ""}.each do |proj|
    items_list = items[proj].shuffle
    include_file = "_includes/#{proj}-items.html"
    puts "writing updated " + include_file
    File.write(include_file, items_list.join("\n"))
  end
end
