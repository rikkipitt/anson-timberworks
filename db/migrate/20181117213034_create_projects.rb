class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :title
      t.attachment :image
      t.text :copy
      t.references :category, foreign_key: true
      t.boolean :published, null: false, default: false

      t.timestamps
    end
  end
end
