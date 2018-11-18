class CreateTaggings < ActiveRecord::Migration[5.2]
  def change
    create_table :taggings do |t|
      t.references :taggable, polymorphic: true
      t.references :tag, foreign_key: true

      t.timestamps
    end
  end
end
