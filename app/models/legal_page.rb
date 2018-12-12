class LegalPage < ApplicationRecord
  has_paper_trail
  acts_as_nested_set

  default_scope { order(:lft) }
  extend FriendlyId
  friendly_id :title, use: :slugged

  validates_presence_of :title, :copy

  rails_admin do
    navigation_label "Legal"
    field :title
    field :copy, :ck_editor
  end
end
