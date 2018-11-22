class CreateHomePages < ActiveRecord::Migration[5.2]
  def change
    create_table :home_pages do |t|
      t.text :hero
      t.text :introduction
      t.text :quote
      t.string :quote_citation

      t.timestamps
    end
  end
end
