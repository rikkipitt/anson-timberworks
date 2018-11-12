class InstagramImage < ApplicationRecord
  has_paper_trail

  scope :published, -> { where(published: true).order(id: :desc) }

  has_attached_file :image, {
    styles: {thumb: "100x100#", medium: "800x800#", small: "350x350#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  rails_admin do
    navigation_label "Instagram"

    object_label_method do
      :custom_label_method
    end
  end

  def custom_label_method
    self.text
  end

  def self.fetch
    Instagram.configure do |config|
      config.client_id = ENV["INSTAGRAM_CLIENT_ID"]
      config.access_token = ENV["INSTAGRAM_ACCESS_TOKEN"]
    end

    medium = Instagram.user_recent_media(ENV["INSTAGRAM_USER_ID"])

    medium.reverse.each do |media|
      next if exists?(iid: media.id) || media.type == "video"
      InstagramImage.create({
        iid: media.id,
        time: DateTime.strptime(media.created_time, "%s"),
        link: media.link,
        image_url: media.images.standard_resolution.url,
        image: URI.parse(media.images.standard_resolution.url),
        text: media.caption ? media.caption&.text.each_char.select { |c| c.bytes.count < 4 }.join("") : nil, # Remove emoji
        published: true,
      })
    end
  end
end
