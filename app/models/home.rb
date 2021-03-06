class Home
  def carousel_slides
    @carousel_slides = CarouselSlide.published
  end

  def copy
    @copy ||= HomePage.first
  end

  def team_members
    @team_members ||= TeamMember.published
  end

  def our_processes
    @our_processes ||= OurProcess.published
  end

  def timberworks
    @timberworks ||= Project.categorised_by("timberworks").published
  end

  def passiveworks
    @passiveworks ||= Project.categorised_by("passiveworks").published
  end

  def bespoke
    @bespoke ||= Project.categorised_by("bespoke").published
  end

  def instagram_images
    @instagram_images ||= InstagramImage.published.limit(5)
  end

  def blogs
    @blogs ||= Blog.published.limit(5)
  end
end
