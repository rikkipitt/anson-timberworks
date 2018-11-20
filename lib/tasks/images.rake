# frozen_string_literal: true

namespace :images do
  desc 'Imports WP blogs'
  task fix: :environment do
    blogs = Blog.where("image_file_name IS NOT NULL")

    blogs.each do |b|
      input_file = open("https:#{b.image.url}")

      output_file = Tempfile.new([b.image_file_name, '.jpeg'])

      output_file.binmode
      output_file.write input_file.read
      output_file.flush

      output_file.seek(0)

      b.image = output_file
      b.save
    end
  end
end
