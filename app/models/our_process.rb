class OurProcess < ApplicationRecord
  has_paper_trail
  acts_as_nested_set

  default_scope { order(lft: :asc) }
  scope :published, -> { where(published: true) }

  has_attached_file :icon, {}.merge(PAPERCLIP_STORAGE_OPTIONS)
  validates_attachment_file_name :icon, matches: [/svg\Z/]

  validates_presence_of :icon, :title, :copy

  rails_admin do
    field :icon
    field :title
    field :copy, :ck_editor
    field :published
  end
end
