const mongoose = require('mongoose');
const marked = require('marked'); // Allows for markdown to render as html
const slugify = require('slugify'); // Allows for title to replace article id in url
const createDomPurify = require('dompurify'); // Strip out everything that contains dangerous HTML
const { JSDOM } = require('jsdom'); // Needed for dompurify package
const domPurify = createDomPurify( new JSDOM().window ) // Needed for dompurify package

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true }) // strict removes characters from title that are not allowed in url such as colons
    }

    if (this.markdown) {
        this.sanitizedHtml = domPurify.sanitize(marked.parse(this.markdown));
    }
    next()
});

module.exports = mongoose.model('Article', articleSchema);
