class HomePage < ApplicationRecord
  has_paper_trail

  validates_presence_of :introduction, :quote, :quote_citation

  rails_admin do
    label_plural "Home page"

    field :introduction, :ck_editor
    field :quote
    field :quote_citation
  end
end
