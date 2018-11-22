class CreateOurProcesses < ActiveRecord::Migration[5.2]
  def change
    create_table :our_processes do |t|
      t.attachment :icon
      t.string :title
      t.text :copy
      t.integer :parent_id
      t.integer :lft
      t.integer :rgt
      t.boolean :published

      t.timestamps
    end
    add_index :our_processes, :parent_id
    add_index :our_processes, :lft
    add_index :our_processes, :rgt
  end
end
