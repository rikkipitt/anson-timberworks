class TeamMember < ApplicationRecord
  has_paper_trail

  scope :published, -> { where(published: true) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "600x600#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates_presence_of :name, :position, :image, :intro

  rails_admin do
    field :name
    field :position
    field :intro
    field :image
    field :published
  end
end
