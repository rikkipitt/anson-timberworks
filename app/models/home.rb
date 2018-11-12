class Home
  def copy
    @copy ||= HomePage.first
  end

  def instagram_images
    @instagram_images ||= InstagramImage.published.limit(6)
  end
end
