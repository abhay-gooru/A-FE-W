import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Selected rating
   * @property {int between 0-5}
   */
  rating:     0,
  /**
   * Max rating
   * @property
   */
  maxRating:  5,

  /**
   * This is triggered when the rating change
   * @property {string} on selection action
   */
  onChangeAction: null,

  /**
   *
   * @property {string} size class
   *
   */
  "rating-star-size": 'rating-stars-lg',

  /**
   *
   * @property {boolean} true if the component is clickeable
   *
   */
  isClickable: true,


  /**
   * Return array with empty and full stars
   * @param rating
   * @param maxRating
   * @return {{ rating: number, full: string}[]}
   */
  stars: Ember.computed('rating', 'maxRating', function() {
    var rating = Math.round(this.get('rating'));
    var fullStars = this.starRange(1, rating, 'full');
    var emptyStars = this.starRange(rating + 1, this.get('maxRating'), 'empty');
    return fullStars.concat(emptyStars);
  }),
  /**
   * Create a range of stars
   * @param start of the range
   * @param end of the range
   * @param type {empty or full}
   */
  starRange: function(start, end, type) {
    var starsData = [];
    for (var i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    }
    return starsData;
  },

  actions: {
    /**
     * Triggered when change the rating
     * @param newRating
     */
    onSetRating: function(newRating,isClickable) {
      if(isClickable){
        if(this.get("rating") === newRating){
          this.set("rating",0);
        }else{
          this.set("rating",newRating);
          if (this.get("onChangeAction")) {
            this.sendAction("onChangeAction", newRating);
          }
        }
      }

    }
  }
});
