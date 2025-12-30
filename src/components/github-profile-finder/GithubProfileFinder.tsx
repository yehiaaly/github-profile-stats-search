import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import type { GitHubUser } from "../../types/github-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Users,
  BookOpen,
  MapPin,
  Link as LinkIcon,
  Building,
  Twitter,
  Calendar,
  Search,
  LayoutGrid,
  Loader2,
} from "lucide-react";

const GithubProfileFinder = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    fetchUser(userName);
  };

  const fetchUser = useCallback(async (nametoSearch: string) => {
    if (!nametoSearch.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`https://api.github.com/users/${nametoSearch}`);
      const data: GitHubUser = await res.json();

      if (data && data.login) {
        setUserData(data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.log(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const searchDelay = setTimeout(() => {
      fetchUser(userName);
    }, 500);
    return () => clearTimeout(searchDelay);
  }, [fetchUser, userName]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-muted/55 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="text-primary h-6 w-6" />
            Github Profile Finder
          </CardTitle>
          <CardDescription>
            Search any GitHub user to get their profile statistics and
            information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <Input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              className="flex-1"
              type="text"
              placeholder="Type to search a username... (e.g. yehiaaly)"
              required
            />
          </form>

          {loading ? (
            <div className="animate-in fade-in duration-300">
              <Item
                variant="muted"
                size="default"
                className="flex flex-col justify-center border-2 border-dashed py-12"
              >
                <ItemMedia variant="default">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-lg font-medium">
                    Fetching Profile...
                  </ItemTitle>
                </ItemContent>
              </Item>
            </div>
          ) : userData ? (
            <div className="animate-in slide-in-from-bottom-2 space-y-6 duration-700">
              {/* Profile Header */}
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <Avatar className="border-background h-24 w-24 border-2 shadow-lg">
                  <AvatarImage src={userData.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {userData.name?.charAt(0) || userData.login.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {userData.name || userData.login}
                    </h1>
                    <span className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      Joined {formatDate(userData.created_at)}
                    </span>
                  </div>
                  <p className="text-primary font-medium">@{userData.login}</p>
                  {userData.bio && (
                    <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed">
                      {userData.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="bg-secondary/50 border-border/50 flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all">
                  <BookOpen className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Repos
                  </span>
                  <span className="text-xl font-bold">
                    {userData.public_repos}
                  </span>
                </div>
                <div className="bg-secondary/50 border-border/50 flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all">
                  <Users className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Followers
                  </span>
                  <span className="text-xl font-bold">
                    {userData.followers}
                  </span>
                </div>
                <div className="bg-secondary/50 border-border/50 flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all">
                  <Users className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Following
                  </span>
                  <span className="text-xl font-bold">
                    {userData.following}
                  </span>
                </div>
                <div className="bg-secondary/50 border-border/50 flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all">
                  <LayoutGrid className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Gists
                  </span>
                  <span className="text-xl font-bold">
                    {userData.public_gists}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-t-4 pt-4 text-sm md:grid-cols-2">
                <div className="text-muted-foreground flex items-center gap-3 italic">
                  <MapPin className="h-4 w-4" />
                  {userData.location || "Not Available"}
                </div>
                <div className="text-muted-foreground flex items-center gap-3 italic">
                  <Twitter className="h-4 w-4" />
                  {userData.twitter_username ? (
                    <a
                      href={`https://twitter.com/${userData.twitter_username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      @{userData.twitter_username}
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-3 overflow-hidden italic">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  {userData.blog ? (
                    <a
                      href={
                        userData.blog.startsWith("http")
                          ? userData.blog
                          : `https://${userData.blog}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary truncate transition-colors"
                    >
                      {userData.blog}
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-3 italic">
                  <Building className="h-4 w-4" />
                  {userData.company || "Not Available"}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-2 hover:bg-gray-800 hover:text-white md:w-auto"
                >
                  <a href={userData.html_url} target="_blank" rel="noreferrer">
                    View Full Github Profile
                  </a>
                </Button>
              </div>
            </div>
          ) : !loading && userData === null && userName !== "" ? (
            <div className="space-y-2 py-12 text-center">
              <p className="text-muted-foreground text-lg font-medium">
                User not found
              </p>
              <p className="text-muted-foreground/60 text-sm">
                Try searching for another username
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default GithubProfileFinder;
