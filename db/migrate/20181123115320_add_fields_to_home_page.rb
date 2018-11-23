class AddFieldsToHomePage < ActiveRecord::Migration[5.2]
  def change
    add_column :home_pages, :timberworks, :text
    add_column :home_pages, :passiveworks, :text
    add_column :home_pages, :bespoke, :text
  end
end
