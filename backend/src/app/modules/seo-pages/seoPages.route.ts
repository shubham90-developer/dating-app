import express from "express";
import {
  createSeoPages,
  deleteSeoPages,
  getAllSeoPages,
  getByIdSeoPages,
  updateSeoPages,
} from "./seoPages.controller";
import { upload } from "../../config/cloudinary";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "aboutBgImage", maxCount: 1 },
  { name: "servicesBgImage", maxCount: 1 },
  { name: "servicesDetailsBgImage", maxCount: 1 },
  { name: "productBgImage", maxCount: 1 },
  { name: "productDetailsBgImage", maxCount: 1 },
  { name: "newsBgImage", maxCount: 1 },
  { name: "newsDetailsBgImage", maxCount: 1 },
  { name: "careerBgImage", maxCount: 1 },
  { name: "contactBgImage", maxCount: 1 },
  { name: "awardBgImage", maxCount: 1 },
  { name: "ourPartnerBgImage", maxCount: 1 },
  { name: "mediaCoverageBgImage", maxCount: 1 },
  { name: "galleryBgImage", maxCount: 1 },
  { name: "faqBgImage", maxCount: 1 },
  { name: "privacyBgImage", maxCount: 1 },
  { name: "termsBgImage", maxCount: 1 },
]);

/**
 * @swagger
 * components:
 *   schemas:
 *     SeoPage:
 *       type: object
 *       properties:
 *         _id: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *         aboutTitle: { type: string, example: "About Us Page" }
 *         aboutSubTitle: { type: string, example: "Everything you need to know about our about us" }
 *         aboutBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/about-bg.jpg" }
 *         servicesTitle: { type: string, example: "Services Page" }
 *         servicesSubTitle: { type: string, example: "Everything you need to know about our services" }
 *         servicesBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/services-bg.jpg" }
 *         servicesDetailsTitle: { type: string, example: "Services Details Page" }
 *         servicesDetailsSubTitle: { type: string, example: "Everything you need to know about our services details" }
 *         servicesDetailsBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/servicesDetails-bg.jpg" }
 *         productTitle: { type: string, example: "Product Page" }
 *         productSubTitle: { type: string, example: "Everything you need to know about our product" }
 *         productBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/product-bg.jpg" }
 *         productDetailsTitle: { type: string, example: "Product Details Page" }
 *         productDetailsSubTitle: { type: string, example: "Everything you need to know about our product details" }
 *         productDetailsBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/productDetails-bg.jpg" }
 *         newsTitle: { type: string, example: "News Page" }
 *         newsSubTitle: { type: string, example: "Everything you need to know about our news" }
 *         newsBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/news-bg.jpg" }
 *         newsDetailsTitle: { type: string, example: "News Details Page" }
 *         newsDetailsSubTitle: { type: string, example: "Everything you need to know about our news details" }
 *         newsDetailsBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/newsDetails-bg.jpg" }
 *         careerTitle: { type: string, example: "Career Page" }
 *         careerSubTitle: { type: string, example: "Everything you need to know about our career" }
 *         careerBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/career-bg.jpg" }
 *         contactTitle: { type: string, example: "Contact Page" }
 *         contactSubTitle: { type: string, example: "Everything you need to know about our contact" }
 *         contactBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/contact-bg.jpg" }
 *         awardTitle: { type: string, example: "Award Page" }
 *         awardSubTitle: { type: string, example: "Everything you need to know about our award" }
 *         awardBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/award-bg.jpg" }
 *         ourPartnerTitle: { type: string, example: "Our Partner Page" }
 *         ourPartnerSubTitle: { type: string, example: "Everything you need to know about our our partner" }
 *         ourPartnerBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/ourPartner-bg.jpg" }
 *         mediaCoverageTitle: { type: string, example: "Media Coverage Page" }
 *         mediaCoverageSubTitle: { type: string, example: "Everything you need to know about our media coverage" }
 *         mediaCoverageBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/mediaCoverage-bg.jpg" }
 *         galleryTitle: { type: string, example: "Gallery Page" }
 *         gallerySubTitle: { type: string, example: "Everything you need to know about our gallery" }
 *         galleryBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/gallery-bg.jpg" }
 *         faqTitle: { type: string, example: "FAQ Page" }
 *         faqSubTitle: { type: string, example: "Everything you need to know about our faq" }
 *         faqBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/faq-bg.jpg" }
 *         privacyTitle: { type: string, example: "Privacy Policy Page" }
 *         privacySubTitle: { type: string, example: "Everything you need to know about our privacy policy" }
 *         privacyBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/privacy-bg.jpg" }
 *         termsTitle: { type: string, example: "Terms & Conditions Page" }
 *         termsSubTitle: { type: string, example: "Everything you need to know about our terms & conditions" }
 *         termsBgImage: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/seo-pages/terms-bg.jpg" }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     SeoPageSuccessResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "SEO pages content retrieved successfully" }
 *         data: { $ref: '#/components/schemas/SeoPage' }
 *     SeoPageListResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "SEO pages content retrieved successfully" }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/SeoPage' }
 *     SeoPageErrorResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         statusCode: { type: integer, example: 400 }
 *         message: { type: string, example: "Validation error" }
 */

/**
 * @swagger
 * /v1/api/seo-pages:
 *   post:
 *     summary: Create SEO pages content
 *     description: |
 *       Creates the SEO title/subtitle/background-image content used across the public marketing site
 *       (About, Services, Product, News, Career, Contact, Award, Our Partner, Media Coverage, Gallery, FAQ, Privacy and Terms pages).
 *       All fields are optional; only send the sections you want to set.
 *     tags: [SEO Pages]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               aboutTitle: { type: string, example: "About Us Page" }
 *               aboutSubTitle: { type: string, example: "Everything you need to know about our about us" }
 *               aboutBgImage: { type: string, format: binary, description: "Background image for the About Us section" }
 *               servicesTitle: { type: string, example: "Services Page" }
 *               servicesSubTitle: { type: string, example: "Everything you need to know about our services" }
 *               servicesBgImage: { type: string, format: binary, description: "Background image for the Services section" }
 *               servicesDetailsTitle: { type: string, example: "Services Details Page" }
 *               servicesDetailsSubTitle: { type: string, example: "Everything you need to know about our services details" }
 *               servicesDetailsBgImage: { type: string, format: binary, description: "Background image for the Services Details section" }
 *               productTitle: { type: string, example: "Product Page" }
 *               productSubTitle: { type: string, example: "Everything you need to know about our product" }
 *               productBgImage: { type: string, format: binary, description: "Background image for the Product section" }
 *               productDetailsTitle: { type: string, example: "Product Details Page" }
 *               productDetailsSubTitle: { type: string, example: "Everything you need to know about our product details" }
 *               productDetailsBgImage: { type: string, format: binary, description: "Background image for the Product Details section" }
 *               newsTitle: { type: string, example: "News Page" }
 *               newsSubTitle: { type: string, example: "Everything you need to know about our news" }
 *               newsBgImage: { type: string, format: binary, description: "Background image for the News section" }
 *               newsDetailsTitle: { type: string, example: "News Details Page" }
 *               newsDetailsSubTitle: { type: string, example: "Everything you need to know about our news details" }
 *               newsDetailsBgImage: { type: string, format: binary, description: "Background image for the News Details section" }
 *               careerTitle: { type: string, example: "Career Page" }
 *               careerSubTitle: { type: string, example: "Everything you need to know about our career" }
 *               careerBgImage: { type: string, format: binary, description: "Background image for the Career section" }
 *               contactTitle: { type: string, example: "Contact Page" }
 *               contactSubTitle: { type: string, example: "Everything you need to know about our contact" }
 *               contactBgImage: { type: string, format: binary, description: "Background image for the Contact section" }
 *               awardTitle: { type: string, example: "Award Page" }
 *               awardSubTitle: { type: string, example: "Everything you need to know about our award" }
 *               awardBgImage: { type: string, format: binary, description: "Background image for the Award section" }
 *               ourPartnerTitle: { type: string, example: "Our Partner Page" }
 *               ourPartnerSubTitle: { type: string, example: "Everything you need to know about our our partner" }
 *               ourPartnerBgImage: { type: string, format: binary, description: "Background image for the Our Partner section" }
 *               mediaCoverageTitle: { type: string, example: "Media Coverage Page" }
 *               mediaCoverageSubTitle: { type: string, example: "Everything you need to know about our media coverage" }
 *               mediaCoverageBgImage: { type: string, format: binary, description: "Background image for the Media Coverage section" }
 *               galleryTitle: { type: string, example: "Gallery Page" }
 *               gallerySubTitle: { type: string, example: "Everything you need to know about our gallery" }
 *               galleryBgImage: { type: string, format: binary, description: "Background image for the Gallery section" }
 *               faqTitle: { type: string, example: "FAQ Page" }
 *               faqSubTitle: { type: string, example: "Everything you need to know about our faq" }
 *               faqBgImage: { type: string, format: binary, description: "Background image for the FAQ section" }
 *               privacyTitle: { type: string, example: "Privacy Policy Page" }
 *               privacySubTitle: { type: string, example: "Everything you need to know about our privacy policy" }
 *               privacyBgImage: { type: string, format: binary, description: "Background image for the Privacy Policy section" }
 *               termsTitle: { type: string, example: "Terms & Conditions Page" }
 *               termsSubTitle: { type: string, example: "Everything you need to know about our terms & conditions" }
 *               termsBgImage: { type: string, format: binary, description: "Background image for the Terms & Conditions section" }
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageSuccessResponse' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageErrorResponse' }
 *   get:
 *     summary: Get all SEO pages content
 *     description: Returns all SEO pages content entries.
 *     tags: [SEO Pages]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageListResponse' }
 */
router.post("/", uploadFields, createSeoPages);
router.get("/", getAllSeoPages);

/**
 * @swagger
 * /v1/api/seo-pages/{id}:
 *   get:
 *     summary: Get SEO pages content by ID
 *     tags: [SEO Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: SEO pages content ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageSuccessResponse' }
 *       404:
 *         description: SEO pages content not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageErrorResponse' }
 *   put:
 *     summary: Update SEO pages content
 *     description: Partially updates SEO pages content. Any field or image omitted keeps its previous value.
 *     tags: [SEO Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: SEO pages content ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               aboutTitle: { type: string, example: "About Us Page" }
 *               aboutSubTitle: { type: string, example: "Everything you need to know about our about us" }
 *               aboutBgImage: { type: string, format: binary, description: "Background image for the About Us section" }
 *               servicesTitle: { type: string, example: "Services Page" }
 *               servicesSubTitle: { type: string, example: "Everything you need to know about our services" }
 *               servicesBgImage: { type: string, format: binary, description: "Background image for the Services section" }
 *               servicesDetailsTitle: { type: string, example: "Services Details Page" }
 *               servicesDetailsSubTitle: { type: string, example: "Everything you need to know about our services details" }
 *               servicesDetailsBgImage: { type: string, format: binary, description: "Background image for the Services Details section" }
 *               productTitle: { type: string, example: "Product Page" }
 *               productSubTitle: { type: string, example: "Everything you need to know about our product" }
 *               productBgImage: { type: string, format: binary, description: "Background image for the Product section" }
 *               productDetailsTitle: { type: string, example: "Product Details Page" }
 *               productDetailsSubTitle: { type: string, example: "Everything you need to know about our product details" }
 *               productDetailsBgImage: { type: string, format: binary, description: "Background image for the Product Details section" }
 *               newsTitle: { type: string, example: "News Page" }
 *               newsSubTitle: { type: string, example: "Everything you need to know about our news" }
 *               newsBgImage: { type: string, format: binary, description: "Background image for the News section" }
 *               newsDetailsTitle: { type: string, example: "News Details Page" }
 *               newsDetailsSubTitle: { type: string, example: "Everything you need to know about our news details" }
 *               newsDetailsBgImage: { type: string, format: binary, description: "Background image for the News Details section" }
 *               careerTitle: { type: string, example: "Career Page" }
 *               careerSubTitle: { type: string, example: "Everything you need to know about our career" }
 *               careerBgImage: { type: string, format: binary, description: "Background image for the Career section" }
 *               contactTitle: { type: string, example: "Contact Page" }
 *               contactSubTitle: { type: string, example: "Everything you need to know about our contact" }
 *               contactBgImage: { type: string, format: binary, description: "Background image for the Contact section" }
 *               awardTitle: { type: string, example: "Award Page" }
 *               awardSubTitle: { type: string, example: "Everything you need to know about our award" }
 *               awardBgImage: { type: string, format: binary, description: "Background image for the Award section" }
 *               ourPartnerTitle: { type: string, example: "Our Partner Page" }
 *               ourPartnerSubTitle: { type: string, example: "Everything you need to know about our our partner" }
 *               ourPartnerBgImage: { type: string, format: binary, description: "Background image for the Our Partner section" }
 *               mediaCoverageTitle: { type: string, example: "Media Coverage Page" }
 *               mediaCoverageSubTitle: { type: string, example: "Everything you need to know about our media coverage" }
 *               mediaCoverageBgImage: { type: string, format: binary, description: "Background image for the Media Coverage section" }
 *               galleryTitle: { type: string, example: "Gallery Page" }
 *               gallerySubTitle: { type: string, example: "Everything you need to know about our gallery" }
 *               galleryBgImage: { type: string, format: binary, description: "Background image for the Gallery section" }
 *               faqTitle: { type: string, example: "FAQ Page" }
 *               faqSubTitle: { type: string, example: "Everything you need to know about our faq" }
 *               faqBgImage: { type: string, format: binary, description: "Background image for the FAQ section" }
 *               privacyTitle: { type: string, example: "Privacy Policy Page" }
 *               privacySubTitle: { type: string, example: "Everything you need to know about our privacy policy" }
 *               privacyBgImage: { type: string, format: binary, description: "Background image for the Privacy Policy section" }
 *               termsTitle: { type: string, example: "Terms & Conditions Page" }
 *               termsSubTitle: { type: string, example: "Everything you need to know about our terms & conditions" }
 *               termsBgImage: { type: string, format: binary, description: "Background image for the Terms & Conditions section" }
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageSuccessResponse' }
 *       404:
 *         description: SEO pages content not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageErrorResponse' }
 *   delete:
 *     summary: Delete SEO pages content
 *     tags: [SEO Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: SEO pages content ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageSuccessResponse' }
 *       404:
 *         description: SEO pages content not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SeoPageErrorResponse' }
 */
router.get("/:id", getByIdSeoPages);
router.put("/:id", uploadFields, updateSeoPages);
router.delete("/:id", deleteSeoPages);

export const seoPagesRouter = router;
