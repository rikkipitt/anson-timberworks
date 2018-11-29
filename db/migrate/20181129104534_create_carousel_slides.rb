class CreateCarouselSlides < ActiveRecord::Migration[5.2]
  def change
    create_table :carousel_slides do |t|
      t.attachment :image
      t.attachment :video
      t.integer :parent_id
      t.integer :lft
      t.integer :rgt
      t.boolean :published, null: false, default: false

      t.timestamps
    end
    add_index :carousel_slides, :parent_id
    add_index :carousel_slides, :lft
    add_index :carousel_slides, :rgt
  end
end
