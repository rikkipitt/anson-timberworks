class CarouselSlide < ApplicationRecord
  has_paper_trail
  acts_as_nested_set

  default_scope { order(lft: :asc) }
  scope :published, -> { where(published: true) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "1440x810#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  attr_accessor :delete_image
  before_validation { self.image.clear if self.delete_image == "1" }

  has_attached_file :video, {}.merge(PAPERCLIP_STORAGE_OPTIONS)
  validates_attachment_content_type :video, content_type: ["video/mp4"]
  attr_accessor :delete_video
  before_validation { self.video.clear if self.delete_video == "1" }

  rails_admin do
    field :image do
      help "Upload at 1440 x 810px for best results"
    end
    field :video do
      help "Upload videos in mp4 format"
    end
    field :published
  end
end
