class Blog < ApplicationRecord
  has_paper_trail

  scope :published, -> { where(published: true) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "720x810#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates_presence_of :title, :date, :image, :copy, :category

  rails_admin do
    field :title
    field :date
    field :image
    field :copy, :ck_editor
    field :category
    field :published
  end
end
