class CreateInstagramImages < ActiveRecord::Migration[5.2]
  def change
    create_table :instagram_images do |t|
      t.string :iid
      t.datetime :time
      t.string :link
      t.text :text
      t.string :image_url
      t.attachment :image
      t.boolean :published

      t.timestamps
    end
  end
end
