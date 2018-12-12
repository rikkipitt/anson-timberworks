class CreatePictures < ActiveRecord::Migration[5.2]
  def change
    create_table :pictures do |t|
      t.attachment :image
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
