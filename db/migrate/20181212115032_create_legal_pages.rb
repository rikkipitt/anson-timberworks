class CreateLegalPages < ActiveRecord::Migration[5.2]
  def change
    create_table :legal_pages do |t|
      t.string :title
      t.string :slug
      t.text :copy
      t.integer :parent_id
      t.integer :lft
      t.integer :rgt

      t.timestamps
    end
    add_index :legal_pages, :slug, unique: true
    add_index :legal_pages, :parent_id
    add_index :legal_pages, :lft
    add_index :legal_pages, :rgt
  end
end
