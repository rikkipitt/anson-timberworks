class ProjectSlide < ApplicationRecord
  belongs_to :project, inverse_of: :project_slides
  has_paper_trail
  default_scope { order(:position) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "720x810#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  rails_admin do
    visible false
    field :image
    field :copy, :ck_editor
    field :project
  end
end
