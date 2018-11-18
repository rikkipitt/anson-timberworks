FactoryBot.define do
  factory :tagging do
    taggable { nil }
    tag { nil }
  end
  factory :tag do
    title { "MyString" }
    slug { "MyString" }
  end
  factory :blog do
    title { "MyString" }
    slug { "MyString" }
    date { "MyString" }
    copy { "MyText" }
    published { false }
  end
  factory :project do
    title { "MyString" }
    image { "" }
    copy { "MyText" }
    category { nil }
    published { false }
  end
  factory :category do
    title { "MyString" }
  end
  factory :team_member do
    name { "MyString" }
    position { "MyString" }
    intro { "MyText" }
    image { "" }
    published { false }
  end
  factory :instagram_image do
    iid { "MyString" }
    time { "2018-11-12 15:10:56" }
    link { "MyString" }
    text { "MyText" }
    image_url { "MyString" }
    image { "" }
    published { false }
  end
  factory :user do
    
  end
end
