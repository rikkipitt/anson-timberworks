class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.admin
      can :manage, :all
      cannot :create, HomePage if HomePage.count > 0

      cannot :destroy, [HomePage]
    else
      can :read, :all
    end
  end
end
