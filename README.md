# Loud
iOS app to classify, manage and listen to your favourite music on Soundcloud. [Loud Webpage](http://mynameisbianchi.herokuapp.com/projects/loud/)

![Loud Cover](https://github.com/giuseppebianchi/loud/blob/master/resources/screenshots/LOUD_cover.jpg?raw=true)

# Demo
Take a look to the video here below to see how LOUD works.

[https://www.youtube.com/watch?v=32ZtMs9uvwg](https://www.youtube.com/watch?v=32ZtMs9uvwg)


# LOUD is the best way to use Soundcloud
SoundCloud is the most famous platform to share music. All tracks are available for free and you can have a better experience with them by using a less social context service. LOUD is focused more on music context, offering new features to organize your SoundCloud music like a real music library, in an easy and beautiful way.

Listening to single tracks and long tracks together can be annoying, so LOUD allows you to manage your favourite podcast in a specific library, dividing them by Radio Stations. In your profile, Likes are orginized and divided by Users, and you can show your Followings, ordering them even by name.

>- **LIBRARY**: Keep all your track together also dived by Artist or Album
>- **PODCAST**: Manage your long tracks, such as Live Recordings, by Radio Station
>- **PROFILE**: Check your Likes, even ordered by User, and your Following
>- **DISCOVER**: Set a Discover song to keep track of all related tracks.

## Organize your library any way you want to
LOUD offers a free music streaming service using all uploaded music on SoundCloud, which is not just a Social Network but it can be seen as a big resource of music as well. Create Artists, Albums and Radio Stations, and enjoy them whenever and wherever in the best way.

>Although some copyrighted songs are missing, on SoundCloud you can find a lot of unreleased tracks, cover songs, podcasts, live recordings, which are not available on other platforms.

## LIBRARY
#### No more playlists to organize your music
Library keeps all your favourite music together, organizing tracks by artist and album. Find tracks on SoundCloud, set artist and album and put them into your library. Quickly browse your whole collection, listening to a specific album or a single artist.
![Loud Library](https://github.com/giuseppebianchi/loud/blob/master/resources/screenshots/loud_library.jpg?raw=true)

It's like iTunes or Apple Music, but, using SoundCloud's music, everything is free.

## PODCAST
#### Listening to single tracks and long tracks together can be annoying
On SoundCloud you can find a lot of radio podcasts or live recordings, which can be annoying while listening to a set of single tracks. LOUD offers a specific section, like Library section, to save and organize these long tracks, dividing them by Radio Station. Radio Station has the same meaning of Artist in the Library.

While adding a track into Library, LOUD is going to recognize track's duration so to suggest where selected track should go for having the best experience.

## PLAYER
#### Enough with all those boring and small buttons
A beautiful gestures-based player is waiting for you. No button but you can do everything with gestures. Swipe left to skip song and swipe right to come back. Double tap to pause and play song. Swipe up or down to hide player.
![Loud Player](https://github.com/giuseppebianchi/loud/blob/master/resources/screenshots/loud_player.jpg?raw=true)

## PROFILE
#### Your tracks, playlists, likes and followings
LOUD offers a profile view to see your tracks and playlists, likes and following. The features about LOUD's profile is that you can classify your likes by uploader, browsing them in an easier way, and show your followings, which can be even ordered by name.

![Loud Profile](https://github.com/giuseppebianchi/loud/blob/master/resources/screenshots/loud_profile.jpg?raw=true)

## DISCOVER
#### New music recommendations based on what you are listening to
Set a playing song as Discover Track to see its related songs. Results will be saved in Discover section and you will be free to listen to them whenever you want. You will love new tracks.

## STREAM
#### New music from your following
Stream shows every new uploaded track and repost by your followings.

Search new music. Discover songs. Grown your Library.
![Loud Stream](https://github.com/giuseppebianchi/loud/blob/master/resources/screenshots/loud_stream.jpg?raw=true)

# Development
#### Apache Cordova App
LOUD is a hybrid app, based on Apache Cordova, made just with HTML, CSS and JS. Views, models and collections are managed by Backbone as MVC framework. Temporary data are saved on localstorage, instead library tracks are saved by using PouchDB, an in-browser lightweight NoSQL database. Why PouchDB? Beacause in future versions of LOUD (or a website) it can be used as a direct interface to CouchDB-compatible servers keeping the users' data in sync.

Sadly LOUD is not available to download because of some SoundCloud's restrictions, such as Rate Limit, but you can find source code on my GitHub if you would like to try it or improve it. If you are a developer and you like SoundCloud, fork my project on GitHub and contact me to work together.