import prisma from "../db.js";

export const postJob = async (req, res) => {
    try {
        // Verify user is HR
        if (req.user.role !== 'HR') {
            return res.status(403).json({ error: 'Only HR can post jobs' })
        }

        const {
            title,
            description,
            company,
            location,
            remote,
            salaryMin,
            salaryMax,
            employmentType,
            experienceLevel,
            keywords,
            expiresAt
        } = req.body

        // Basic validation
        if (!title || !description || !company) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const newJob = await prisma.job.create({
            data: {
                title,
                description,
                company,
                location,
                remote: remote || false,
                salaryMin,
                salaryMax,
                salaryCurrency: 'USD',
                employmentType,
                experienceLevel,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                postedById: req.user.id,
                keywords: {
                    connectOrCreate: keywords?.map(keyword => ({
                        where: { name: keyword.toLowerCase() },
                        create: { name: keyword.toLowerCase() }
                    }))
                }
            },
            include: {
                keywords: true,
                postedBy: {
                    select: { name: true, email: true }
                }
            }
        })

        res.status(201).json(newJob)
    } catch (error) {
        console.error('Error posting job:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            remote,
            employmentType,
            experienceLevel,
            page = 1,
            limit = 10
        } = req.query

        const filter = {
            isActive: true,
            ...(keyword && {
                keywords: {
                    some: {
                        name: {
                            in: keyword.split(',').map(k => k.toLowerCase())
                        }
                    }
                }
            }),
            ...(location && { location }),
            ...(remote && { remote: remote === 'true' }),
            ...(employmentType && { employmentType }),
            ...(experienceLevel && { experienceLevel })
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where: filter,
                skip: (page - 1) * limit,
                take: parseInt(limit),
                include: {
                    keywords: true,
                    postedBy: {
                        select: { name: true, company: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.job.count({ where: filter })
        ])

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            jobs
        })
    } catch (error) {
        console.error('Error fetching jobs:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getJobDescription = async (req, res) => {
    try {
        const { id } = req.params

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                keywords: true,
                postedBy: {
                    select: { name: true, email: true, company: true }
                }
            }
        })

        if (!job) {
            return res.status(404).json({ error: 'Job not found' })
        }

        if (!job.isActive) {
            return res.status(410).json({ error: 'Job listing has expired' })
        }

        res.json(job)
    } catch (error) {
        console.error('Error fetching job:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}