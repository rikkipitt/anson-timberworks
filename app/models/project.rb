class Project < ApplicationRecord
  has_paper_trail
  acts_as_nested_set

  belongs_to :category

  default_scope { order(lft: :asc) }
  scope :published, -> { where(published: true) }

  has_attached_file :image, {
    styles: {thumb: "100x100>", main: "720x810#"},
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  validates_presence_of :title, :image, :copy, :category

  def self.categorised_by(slug)
    Category.find_by_slug!(slug).projects
  end

  rails_admin do
    field :title
    field :image
    field :copy, :ck_editor
    field :category
    field :published
  end
end
