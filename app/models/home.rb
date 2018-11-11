class Home
  def copy
    @copy ||= HomePage.first
  end
end
