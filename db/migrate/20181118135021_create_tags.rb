class CreateTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :title
      t.string :slug

      t.timestamps
    end
    add_index :tags, :slug, unique: true
  end
end
