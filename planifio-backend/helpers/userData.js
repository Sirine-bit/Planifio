const User = require("../models/User");
const Project = require("../models/Project");
const Assignment = require("../models/Assignment");


async function userData(user) {
  const organizationMembers = await User.find(
    { organization: user.organization, _id: { $ne: user._id } },
    { password: 0 }
  );
  const projects = await Project.find({
    $or: [
      { userId: user._id },
      { teamMembers: user._id }
    ]
  });
  const assignments = await Assignment.find({ userID: user._id });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      organization: user.organization,
      profileImage: user.profileImage ? user.profileImage : null
    },
    organizationMembers,
    projects,
    assignments
  };
}

module.exports = { userData };