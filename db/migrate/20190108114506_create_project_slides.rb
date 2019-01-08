class CreateProjectSlides < ActiveRecord::Migration[5.2]
  def change
    create_table :project_slides do |t|
      t.attachment :image
      t.text :copy
      t.integer :position
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
