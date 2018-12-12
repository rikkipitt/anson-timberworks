class Picture < ApplicationRecord
  belongs_to :project, inverse_of: :pictures

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "720x810#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates_presence_of :image

  rails_admin do
    visible false
  end
end
