class CreateTeamMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :team_members do |t|
      t.string :name
      t.string :position
      t.text :intro
      t.attachment :image
      t.boolean :published

      t.timestamps
    end
  end
end
