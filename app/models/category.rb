class Category < ApplicationRecord
  has_paper_trail

  extend FriendlyId
  friendly_id :title, use: [:slugged]

  has_many :projects

  validates_presence_of :title

  rails_admin do
    field :title
  end
end
