class Project < ApplicationRecord
  has_paper_trail
  acts_as_nested_set

  belongs_to :category
  has_many :pictures, inverse_of: :project, dependent: :destroy
  has_many :project_slides, inverse_of: :project, dependent: :destroy, autosave: true

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
    field :image do
      label "Main image"
    end
    # field :pictures
    # field :copy, :ck_editor
    field :project_slides do
      associated_collection_cache_all true
      orderable true
      help "Required. Use up/down arrows to re-order."
    end
    field :category
    field :published
  end

  def project_slide_ids=(ids)
    super(ids)
    ids = ids.reject(&:blank?).map(&:to_i)
    ids.each_with_index do |id, index|
      project_slides.detect { |p| p.id == id }.position = index + 1
    end
  end
end
