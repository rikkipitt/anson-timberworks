# frozen_string_literal: true

namespace :import do
  desc 'Imports WP blogs'
  task wp: :environment do
    file = File.join(File.dirname(__FILE__), %w[wordpress.xml])
    blog = WpxmlParser::Blog.new(file)

    blog.posts.each do |post|
      puts post.post_id
      doc = Nokogiri::HTML(post.body)

      image = nil

      first_img = doc.search('img').first

      if first_img
        begin
          image = open(first_img.attributes['src'])
        rescue OpenURI::HTTPError => ex
          puts "Image missing"
        end
      end

      blog = Blog.new({ title: post.title, slug: post.slug, date: post.date, copy: post.body, image: image })

      post.categories.each do |tag|
        tag = Tag.find_or_create_by(title: tag)
        blog.tags << tag
      end

      blog.save!
    end
  end
end
