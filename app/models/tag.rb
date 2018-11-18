class Tag < ApplicationRecord
  has_paper_trail

  extend FriendlyId
  friendly_id :title, use: [:slugged]

  has_many :taggings, dependent: :destroy

  validates_presence_of :title

  rails_admin do
    navigation_label "Blog"

    field :title
  end

  def should_generate_new_friendly_id?
    slug.blank? || title_changed?
  end
end
