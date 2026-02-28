const {Register, CreateCampaigns, IndInfo, CreateBlog} = require("../../models/associations");

const getIndividualDetails = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({ // Changed to 400 for bad request
                success: false,
                message: "Cannot extract the id from the req.user"
            });
        }

        const individual = await Register.findOne({
            where: { user_id: id },
            attributes: ['username', 'email', 'createdAt', 'isVerified'],
            include: [
                {
                    model: IndInfo,
                    required: false,
                    attributes: {
                        exclude: ['ind_id', 'user_id', 'updatedAt'],
                    },
                },
                {
                    // This is your Many-to-Many relationship
                    model: CreateCampaigns, 
                    as: 'joinedCampaigns', 
                    through: { attributes: [] }, 
                    where :{ status : "ACTIVE"},
                    attributes: ['campaign_id', 'title', 'image', 'status', 'volunteer', 'category', 'start_date', 'end_date'], // Only return what the frontend needs
                    required: false
                },
                {
                    model: CreateBlog,
                    as: 'upvotedArticles', // This must match the 'as' in Register.belongsToMany(CreateBlog)
                    through: { attributes: [] }, // Hides the UpvotesModel join table data
                    attributes: ['blog_id', 'title', 'content', 'createdAt'], // Customize attributes as needed
                    required: false
                }
            ],
        });

        if (!individual) {
            return res.status(404).json({ // Changed to 404 for not found
                success: false,
                message: "No individual data found"
            });
        }

        return res.status(200).json({ // Changed to 200 for a GET success
            success: true,
            individual
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
}

const updatePfp = async(req, res) =>{
    try{
        const { id } = req.user

        const thumbnail = req.files?.thumbnail
        ? `uploads/${req.files.thumbnail[0].filename}`
        : null;

        const images = req.files?.images
        ? req.files.images.map(file => `uploads/${file.filename}`)
        : [];

        if(!thumbnail) return res.status(400).json("FilePath is empty");

        await IndInfo.upsert({
            user_id : id,
            logo_path : thumbnail

        })

        return res.status(201).json("image uploaded successfully")
    }catch(err){
        return res.status(500).json({ 
            message : "server side errorrrrr",
            error : err.message
        });
    }
}

const updateIndividualDetails = async (req, res) => {
    try {
        const { id } = req.user; 
        const { indName, email, bio, country, state, city, street } = req.body;

        const user = await Register.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Combine address parts into a single string for the database
        const fullAddress = `${country || ''} ${state || ''} ${city || ''} ${street || ''}`.trim();

        await Register.update(
            { 
                username: indName, 
                email: email 
            },
            { where: { user_id: id } }
        );

        // upsert ensures it creates the record if by some chance it doesn't exist
        await IndInfo.upsert({
                user_id : id,
                description: bio,
                address: fullAddress
            });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: err.message
        });
    }
};

const getIndRecentActivity =async(req, res) => {

    const { id } = req.user
    if(!id){
        return res.status(400).json({
             message : "id not passed"
        })
    }
    console.log(id)

    const response = await Register.findOne({
        where: { user_id: id},
        attributes : [],
        include: [
            {
                model: CreateCampaigns,
                as: 'joinedCampaigns',
                attributes: ["campaign_id", "title", "description", "volunteer", "status", "category", "start_date", "end_date"],
                through: { attributes: ['createdAt'] } 
            },
        ]
    });

    return res.status(201).json({
        message : "recent activity fetched",
        recentActivities : response
    })
}

module.exports = { getIndividualDetails, updateIndividualDetails, getIndRecentActivity, updatePfp};