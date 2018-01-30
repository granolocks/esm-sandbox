require 'pry'
require 'json'
require 'net/http'

task default: :migrate_data_to_templates


DATA_DIR = File.expand_path("../_data/", __FILE__)
desc "Migrate the JSON files located in the data directory into he appropriate project buckets as templates"
task :migrate_data_to_templates do 
  files = ["Photo Upload.json", "Video ID.json"].map{|f| File.join(DATA_DIR, f)}

  files.each do |file|
    content = JSON.parse(File.read(file))
    sheets = content.keys
    sheets.each do |sheet|
      content[sheet].each do |blob|
        if file =~ /Photo Upload/

          # get the image, put it somewhere
          remote_filename, extension =  blob["Photo"].split('/')[-1].split('.')
          
          filename = [
                     blob["Project"].downcase.gsub(/[^0-9a-z\-]/, '-'), 
                     blob["Name"].downcase.gsub(/[^0-9a-z\-]/, '-'),
                     remote_filename.downcase.gsub(/[^0-9a-z\-_]/, '-')[0,10],
          ].join('-') + ".#{extension}"

          #{"Name"=>"Christopher Norris",
          # "Project"=>"Between Land and Water",
          # "Photo"=>
          #"https://apps.cloudstitch.io/alderstudio/__uploads/photo-upload/1517272079025-photo-rPQ2__ybwzmyu6WSjZEd1qJ_.jpg"}
          
          # skip if we already have this file synced
          
          filepath = filename #TODO find out where to put these

          remote_file_body = Net::HTTP.get(URI(blob["Photo"]))

          File.write("./#{filename}", remote_file_body)

          # TODO make this an includable thing
          puts "<img src=\"#{ filepath }\" alt=\"#{blob["Name"]}\" />"
        elsif file =~ /Video ID/
          puts '<iframe src="https://player.vimeo.com/video/'+ blob["VimeoID"] + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        end
      end
    end
  end
end
