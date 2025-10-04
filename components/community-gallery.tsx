"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, Eye, Download, Share2, Filter, TrendingUp, Clock, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data for community designs
const communityDesigns = [
  {
    id: "1",
    title: "Lunar Base Alpha",
    author: "Dr. Sarah Chen",
    destination: "moon",
    crewSize: 4,
    viability: 92,
    likes: 234,
    views: 1520,
    downloads: 89,
    thumbnail: "/lunar-habitat-base-on-moon-surface.jpg",
    tags: ["lunar", "long-term", "research"],
    featured: true,
  },
  {
    id: "2",
    title: "Mars Colony Hub",
    author: "Commander Alex Rivera",
    destination: "mars",
    crewSize: 8,
    viability: 88,
    likes: 189,
    views: 1203,
    downloads: 67,
    thumbnail: "/mars-colony-habitat-red-planet.jpg",
    tags: ["mars", "colony", "sustainable"],
    featured: true,
  },
  {
    id: "3",
    title: "Transit Station Omega",
    author: "Engineer Kim Park",
    destination: "transit",
    crewSize: 6,
    viability: 85,
    likes: 156,
    views: 892,
    downloads: 45,
    thumbnail: "/space-station-transit-habitat.jpg",
    tags: ["transit", "modular", "efficient"],
    featured: false,
  },
  {
    id: "4",
    title: "Hydrogel Research Station",
    author: "Prof. James Wilson",
    destination: "moon",
    crewSize: 3,
    viability: 95,
    likes: 312,
    views: 2104,
    downloads: 134,
    thumbnail: "/bio-research-station-hydrogel-lab.jpg",
    tags: ["research", "bio2", "experimental"],
    featured: true,
  },
  {
    id: "5",
    title: "Compact Mars Outpost",
    author: "Lt. Maria Santos",
    destination: "mars",
    crewSize: 2,
    viability: 78,
    likes: 98,
    views: 654,
    downloads: 32,
    thumbnail: "/compact-mars-outpost-small-habitat.jpg",
    tags: ["mars", "compact", "minimal"],
    featured: false,
  },
  {
    id: "6",
    title: "Extended Duration Habitat",
    author: "Dr. Robert Lee",
    destination: "moon",
    crewSize: 6,
    viability: 90,
    likes: 201,
    views: 1345,
    downloads: 78,
    thumbnail: "/extended-lunar-habitat-long-term.jpg",
    tags: ["lunar", "long-term", "advanced"],
    featured: false,
  },
]

export function CommunityGallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"trending" | "recent" | "popular">("trending")
  const [filterDestination, setFilterDestination] = useState<string>("all")
  const [likedDesigns, setLikedDesigns] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    setLikedDesigns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredDesigns = communityDesigns
    .filter((design) => {
      const matchesSearch =
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesDestination = filterDestination === "all" || design.destination === filterDestination
      return matchesSearch && matchesDestination
    })
    .sort((a, b) => {
      if (sortBy === "trending") return b.likes + b.views / 10 - (a.likes + a.views / 10)
      if (sortBy === "recent") return b.id.localeCompare(a.id)
      if (sortBy === "popular") return b.likes - a.likes
      return 0
    })

  const featuredDesigns = filteredDesigns.filter((d) => d.featured)

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="mb-2 font-orbitron text-4xl font-bold">Community Gallery</h1>
            <p className="text-lg text-muted-foreground">
              Explore habitat designs from the BiO2 community and share your own creations
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search designs, authors, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterDestination} onValueChange={setFilterDestination}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="moon">Moon</SelectItem>
                  <SelectItem value="mars">Mars</SelectItem>
                  <SelectItem value="transit">Transit</SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="trending" className="gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Popular
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured designs */}
        {featuredDesigns.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold">Featured Designs</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredDesigns.map((design) => (
                <DesignCard key={design.id} design={design} isLiked={likedDesigns.has(design.id)} onLike={toggleLike} />
              ))}
            </div>
          </div>
        )}

        {/* All designs */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-orbitron text-2xl font-bold">All Designs</h2>
          <span className="text-sm text-muted-foreground">{filteredDesigns.length} results</span>
        </div>

        {filteredDesigns.length === 0 ? (
          <Card className="flex h-64 items-center justify-center border-dashed">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">No designs found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} isLiked={likedDesigns.has(design.id)} onLike={toggleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface DesignCardProps {
  design: (typeof communityDesigns)[0]
  isLiked: boolean
  onLike: (id: string) => void
}

function DesignCard({ design, isLiked, onLike }: DesignCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
        <img
          src={design.thumbnail || "/placeholder.svg"}
          alt={design.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {design.featured && (
          <Badge className="absolute right-2 top-2 bg-primary/90 text-primary-foreground">
            <Star className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-1 font-orbitron text-lg font-semibold leading-tight">{design.title}</h3>
            <p className="text-sm text-muted-foreground">by {design.author}</p>
          </div>
          <Badge
            variant="outline"
            className={`${
              design.viability >= 90
                ? "border-primary/50 bg-primary/10 text-primary"
                : design.viability >= 70
                  ? "border-chart-5/50 bg-chart-5/10 text-chart-5"
                  : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {design.viability}%
          </Badge>
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {design.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {design.likes}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {design.views}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {design.downloads}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href={`/design?template=${design.id}`}>Open Design</Link>
          </Button>
          <Button
            size="sm"
            variant={isLiked ? "default" : "outline"}
            onClick={() => onLike(design.id)}
            className={isLiked ? "bg-primary text-primary-foreground" : ""}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
