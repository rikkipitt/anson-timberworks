u = User.new(
  email: 'rikki@jemco.de',
  encrypted_password: '$2a$10$X3BE3EV.uc7lXfP2RvEMHuuLSErW2EU72sIck4u.nV2EmsQSVKddO',
  admin: true
)
u.save!(validate: false)

