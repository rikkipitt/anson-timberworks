class Home
  def copy
    @copy ||= HomePage.first
  end

  def team_members
    @team_members ||= TeamMember.published
  end

  def instagram_images
    @instagram_images ||= InstagramImage.published.limit(6)
  end
end
