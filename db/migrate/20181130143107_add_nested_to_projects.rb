class AddNestedToProjects < ActiveRecord::Migration[5.2]
  def self.up
    add_column :projects, :parent_id, :integer
    add_column :projects, :lft, :integer
    add_column :projects, :rgt, :integer

    # This is necessary to update :lft and :rgt columns
    Project.reset_column_information
    Project.rebuild!
  end

  def self.down
    remove_column :projects, :parent_id
    remove_column :projects, :lft
    remove_column :projects, :rgt
  end
end
