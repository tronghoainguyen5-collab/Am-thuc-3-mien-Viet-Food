const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('authorId', 'username').populate('comments');
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;
        const recipe = new Recipe({
            title, description, ingredients, steps, authorId: req.user.id
        });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};