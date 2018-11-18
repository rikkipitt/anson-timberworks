class Blog < ApplicationRecord
  include Taggable
  has_paper_trail

  extend FriendlyId
  friendly_id :title, use: :slugged

  default_scope { order(date: :desc) }
  scope :published, -> { where(published: true) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "800x800#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates_presence_of :title, :date, :image, :copy

  rails_admin do
    navigation_label "Blog"

    field :title
    field :date
    field :image
    field :copy, :ck_editor
    field :tags
    field :published
  end

  def self.tagged_with(slug)
    Tag.find_by_slug!(slug).blogs
  end
end
