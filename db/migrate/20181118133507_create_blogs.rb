class CreateBlogs < ActiveRecord::Migration[5.2]
  def change
    create_table :blogs do |t|
      t.string :title
      t.string :slug
      t.string :date
      t.text :copy
      t.boolean :published, null: false, default: false

      t.timestamps
    end
    add_index :blogs, :slug, unique: true
  end
end
