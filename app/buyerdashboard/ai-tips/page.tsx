'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Bookmark, Eye, Send, Brain, Wheat } from 'lucide-react';

const tips = [
  {
    id: 1,
    title: 'Maize Planting Tips',
    date: 'Jan 15, 2024',
    content:
      "Igihe cy'itemberere rya ibigori ni ukwezi kwa mbere rugira inyungu y'amazi menshi. Kuraguza ubutaka bwawe kandi ushyire ifumbire y'ibinyobwa byawe kugira ngo ubone umusaruro mwiza.",
    category: 'Planting',
    subcategory: 'Maize',
    views: '234 views',
    bookmarked: true,
  },
  {
    id: 2,
    title: 'Bean Fertilizer Application',
    date: 'Jan 14, 2024',
    content:
      "Ibibabi bifite ubushobozi bwo gufata azote mu kirere. Ntushyire ifumbire y'azote nyinshi y'azote ariko ushyire phosphorus na potassium. Byongera umusaruro w'ibibabi byawe.",
    category: 'Fertilizing',
    subcategory: 'Beans',
    views: '189 views',
    bookmarked: false,
  },
  {
    id: 3,
    title: 'Potato Pest Control',
    date: 'Jan 13, 2024',
    content:
      "Reba neza amababi y'ibirayi kugira ngo ubone udukoko duto. Koresha imiti y'ibinyobwa cyangwa ubufite ubushobozi bwo kurwanya udukoko duto. Kuraguza ubufite bwanyu buri cyumweru.",
    category: 'Pest Control',
    subcategory: 'Potatoes',
    views: '156 views',
    bookmarked: false,
  },
  {
    id: 4,
    title: 'Water Management for Maize',
    date: 'Jan 12, 2024',
    content:
      "Ibigori bikeneye amazi menshi mu gihe cy'itemberere. Koresha uburyo bwo kubika amazi kandi utitondere amazi menshi mu gihe cy'umusaruro. Koresha uburyo bwo kubika amazi.",
    category: 'Irrigation',
    subcategory: 'Maize',
    views: '203 views',
    bookmarked: true,
  },
];

const savedTips = [
  { title: 'Bean Fertilizer', date: 'Jan 14' },
  { title: 'Maize Planting', date: 'Jan 10' },
];

export default function AITips() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Tips</h1>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Search here..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="By Crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="beans">Beans</SelectItem>
              <SelectItem value="potatoes">Potatoes</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="By Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="By Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="planting">Planting</SelectItem>
              <SelectItem value="fertilizing">Fertilizing</SelectItem>
              <SelectItem value="pest">Pest Control</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weather Alert */}
      <Card className="bg-orange-100 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Urgent Weather Alert
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                Imvura nyinshi itegerejwe mu minsi 3 iri imbere. Kuraguza ibigori byawe kandi
                witondere amazi udukoko.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-600">Now</p>
              <p className="text-xs text-orange-600">15:30</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tips List */}
        <div className="lg:col-span-2 space-y-4">
          {tips.map(tip => (
            <Card key={tip.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <Wheat className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark
                      className={`h-4 w-4 ${tip.bookmarked ? 'fill-current text-yellow-600' : ''}`}
                    />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{tip.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {tip.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tip.subcategory}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{tip.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Ask AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">Baza ibibazo cyangwa mu Kinyarwanda...</p>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Andika ibibazo hano..." className="flex-1" />
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">AI will respond in Kinyarwanda</p>
            </CardContent>
          </Card>

          {/* Saved Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-green-600" />
                Saved Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-950/20 rounded"
                >
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm text-green-600">
                View All Saved Tips
              </Button>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Tips Read This Week</span>
                <span className="font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tips Bookmarked</span>
                <span className="font-bold text-green-600">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">AI Questions Asked</span>
                <span className="font-bold text-green-600">15</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
